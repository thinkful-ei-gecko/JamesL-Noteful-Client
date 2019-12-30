import React, { Component } from "react";
import ApiContext from "./ApiContext";
import config from "./config";
import PropTypes from 'prop-types';
import ValidationError from './ValidationError';

export default class AddFolder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: {
        value: '',
        touched: false
      }
    }
  }

  static contextType = ApiContext;

  handleAddFolder = (e) => {
    e.preventDefault();

    const newFolder = JSON.stringify({
      folder_name: this.state.name.value
    })

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: newFolder
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(response => this.context.addFolder(response))
      .then(
        this.props.history.push('/'))
      .catch(error => {
        alert(error.message);
      });
  };

  getFolderName = (name) => {
    this.setState({name: {
      value: name,
      touched: true
    }})
  }

  validateFolderName = () => {
    let folderName = this.state.name.value.trim();

    if (folderName.length === 0){
      return 'Folder name is required'
    }
}

  render() {
    return (
      <form className='addNoteOrFolder' onSubmit={this.handleAddFolder}>
        <div>
          <label htmlFor="folderName">Folder Name: </label>
          <input type="text" id="folderName" onChange={e => this.getFolderName(e.target.value) } />
          {this.state.name.touched && (<ValidationError message = {this.validateFolderName()}/>)}
          <button disabled={this.validateFolderName()} type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

AddFolder.propTypes = {
  addFolder: PropTypes.func
}