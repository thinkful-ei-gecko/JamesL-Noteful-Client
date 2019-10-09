import React, { Component } from 'react';
import config from './config';
import ApiContext from './ApiContext';
import PropTypes from 'prop-types'

export default class AddNote extends Component {

  state = {
    name: '',
    content: '',
    folderId: '',
    modified: ''
  }

  static contextType = ApiContext;

  handleAddNote = (e) => {
    e.preventDefault();

    const newNote = {
      note_name: this.state.name,
      date_modified: this.state.modified,
      note_content: this.state.content,
      folder_id: this.state.folderId
    };

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newNote)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
      })
      .then(() => {
        this.context.addNote(newNote);
        this.props.history.push('/');
      })
      .catch(error => {
        alert({ error });
      });
  };

  getNoteName = (e) => {
    this.setState({ name: e.target.value });
  }

  getNoteContent = (e) => {
    this.setState({ content: e.target.value });
  }

  getNoteModified = (e) => {
    this.setState({ modified: new Date().toLocaleString() });
  }

  getNoteFolderId = (e) => {
    this.setState({ folderId: e.target.value });
  }

  validateNoteName = () => {
    let note = this.state.name;

    if (!note) {
      return 'Note name is required'
    } else {
      return null
    }
  }

  validateContent = () => {
    let note = this.state.content;

    if (!note) {
      return 'Note content is required'
    } else {
      return null
    }
  }

  validateFolder = () => {
    let folder = this.state.folderId;

    if (!folder) {
      return 'Note content is required'
    } else {
      return null
    }
  }

  render() {
    const { folders } = this.context;

    return (
      <form className='addNoteOrFolder' onSubmit={e => this.handleAddNote(e)}>
        <div>
          <label htmlFor='noteName'>New Note Name: </label>
          <input type='text' id='noteName' value={this.state.name} onChange={ this.getNoteName } />
          {this.validateNoteName && <p className='validationElement'>{this.validateNoteName()}</p>}
        </div>
        <div>
          <label htmlFor='noteContent'>Content: </label>
          <input type='text' id='noteName' value={this.state.content} onChange={ this.getNoteContent } />
          {this.validateContent && <p className='validationElement'>{this.validateContent()}</p>}
        </div>
        <div>
          <select name='Choose folder...' value={this.state.folderId} onChange={ this.getNoteFolderId }>
            <option key="default" value={null}>Select folder</option>
            {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.folder_name}</option>)}
          </select>
          {this.validateFolder && <p className='validationElement'>{this.validateFolder()}</p>}
        </div>
        <div>
          <button disabled={this.validateNoteName() || this.validateContent() || this.validateFolder()} 
                  type='submit' 
                  onClick={ this.getNoteModified }>
                    Submit
          </button>
        </div>
      </form>
    );
  }
}

AddNote.propTypes = {
  history: PropTypes.object.isRequired
}