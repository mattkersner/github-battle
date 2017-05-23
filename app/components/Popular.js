const React = require('react');
const PropTypes = require('prop-types');
const api = require('../utils/api');
const Loading = require('./Loading');

//stateless functional component
function SelectLanguage(props) {
  const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {languages.map((language) => {
        return (
          <li
          style={language === props.selectedLanguage ? { color: '#d0021b'} : null}
          onClick={props.onSelect.bind(null, language)}
          key={language}>
            {language}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

function RepoGrid(props) {
  return (
    <ul className='popular-list'>
    {props.repos.map(function(repo, index) {
      return (
        <li key={repo.name} className='popular-item'>
          <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img className='avatar' src={repo.owner.avatar_url} alt={'Avatar for ' + repo.owner.login} />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
        </li>
      )
    })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}


class Popular extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };
    //this.updateLanguage we want to be a function whose this keyword is bound to the Popular class
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(language) {
    this.setState(function() {
      return {
        selectedLanguage: language,
        repos: null
      }
    });

    api.fetchPopularRepos(language)
    .then((repos) => {
      this.setState(function() {
        return {
          repos: repos
        }
      })
    })
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage} />
        {!this.state.repos ? <Loading /> : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

module.exports = Popular;
