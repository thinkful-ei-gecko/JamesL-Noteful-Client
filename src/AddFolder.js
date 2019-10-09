import React, { Component } from "react";
import ApiContext from "./ApiContext";
import config from "./config";
import PropTypes from 'prop-types';

export default class AddFolder extends Component {
  state = {
    name: ''
  }

  static contextType = ApiContext;

  handleAddFolder = (e) => {
    e.preventDefault();

    const newFolder = {
      folder_name: this.state.name
    };

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newFolder)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
      })
      .then(() => {
        this.context.addFolder(newFolder);
        this.props.history.push('/');
      })
      .catch(error => {
        console.error({ error });
      });
  };

  getFolderName = (e) => {
    this.setState({name: e.target.value});
  }

  validateFolderName = () => {
    let folderName = this.state.name;

    if (!folderName) {
        return 'Folder name is required'
    } else {
        return null
    }
}

  render() {
    return (
      <form className='addNoteOrFolder' onSubmit={e => this.handleAddFolder(e)}>
        <div>
          <label htmlFor="folderName">New Folder Name: </label>
          <input type="text" id="folderName" value={this.state.name} onChange={ this.getFolderName } />
          {this.validateFolderName && <p className='validationElement'>{this.validateFolderName()}</p>}
          <button disabled={this.validateFolderName()} type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
}