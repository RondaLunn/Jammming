import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter'){
      this.search();
    }
  }

  componentWillMount() {
    let savedTerm = window.localStorage.getItem('searchTerm');
    if (savedTerm) {
      this.setState({term: savedTerm});
      this.props.onSearch(savedTerm);
      window.localStorage.removeItem('searchTerm');
    };
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" value={this.state.term} onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
export default SearchBar;
