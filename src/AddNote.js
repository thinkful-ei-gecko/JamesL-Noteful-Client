import React, { Component } from 'react';
import config from './config';
import ApiContext from './ApiContext';
import ValidationError from './ValidationError';
import PropTypes from 'prop-types'

export default class AddNote extends Component {
  constructor(props) {
    super(props)
      this.state = {
        name: {
          value: '',
          touched: false
        },
        folderId: {
          value: '',
          touched: false
        },
        content: {
          value: '',
          touched: false
      }
    }
  } 

  static contextType = ApiContext;

  handleAddNote = (e) => {
    e.preventDefault();

    const newNote = JSON.stringify({
      title: this.state.name.value,
      folder_id: this.state.folderId.value,
      content: this.state.content.value,
    })

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: newNote
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(response => this.context.addNote(response))
      .then(
        this.props.history.push('/')
      )
      .catch(error => {
        alert( error.message );
      });
  };

  getNoteName = (name) => {
    this.setState({ 
      name: {
        value: name,
        touched: true
      }
    })
  }

  getNoteContent = (content) => {
    this.setState({ 
      content: {
        value: content,
        touched: true
      }
    })
  }

  getNoteFolderId = (folderId) => {
    this.setState({ 
      folderId: {
        value: folderId,
        touched: true
      }
    })
  }

  validateNoteName = () => {
    let name = this.state.name.value.trim();

    if (name.length === 0) {
      return 'Note name is required'
    }
  }

  validateContent = () => {
    let note = this.state.content.value.trim();

    if (!note) {
      return 'Note content is required'
    }
  }

  validateFolder = () => {
    const folder = this.state.folderId.value;
    return !folder
  }

  render() {
    const folderList = this.context.folders.map(folder => {

    return (
      <option key= {folder.id} value={folder.id}>{folder.folder_name}</option>
      )
    })

     
		return (
			<form onSubmit={this.handleAddNote}>
					<label htmlFor="note-name">Title *</label>
					<input 
						id="note-name" 
						type="text" 
						name="note-name"
						onChange={e => this.getNoteName(e.target.value)}
					>
					</input>
					{this.state.name.touched && (<ValidationError message = {this.validateNoteName()}/>)}
          <label htmlFor="content">Content</label>
					<textarea id="content" 
						name="content" 
						onChange={e => this.getNoteContent(e.target.value)}
					></textarea>
					<label htmlFor="folders">Save in *</label>
					<select 
					  id="folders"
					  name="folders"
						onChange={e => this.getNoteFolderId(e.target.value)}
						defaultValue="Select Folder"
					>
					<option disabled>Select Folder</option>
            {folderList}
          </select>
					<button type="submit"
					disabled = {this.validateNoteName()||this.validateFolder()
				}
					>Save</button>
			</form>
		)
	}
}

AddNote.propTypes = {
	folders: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})),
	addNote: PropTypes.func
}