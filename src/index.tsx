import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import "./app.css";

const profileURL = 'https://api.github.com/users/supreetsingh247';
const repositoryURL = "https://api.github.com/users/supreetsingh247/repos";


class Manager {

	@observable profileData: any = [];
	@observable repoData: any = [];

	constructor() {
		this.setProfileInfo();
		this.setRepoInfo();
	}

	@action setProfileInfo(): void {
		fetch(profileURL)
			.then(response => response.json())
			.then(data => this.profileData = data)
	}

	@action setRepoInfo(): void {
		fetch(repositoryURL)
			.then(response => response.json())
			.then(data => this.repoData = data)
	}
}

class ViewModel {

	manager: Manager
	@observable filter: "";
	@observable filteredResult: any = [];

	constructor(manager: Manager) {
		this.manager = manager

	}
	@action handleInput = (value: string)=>{
     this.filteredResult = this.repoData.filter((repo)=>{
			 return !!value && repo.name.toLowerCase().includes(value.toLowerCase())

		 })
	}

	@computed get repoData() {
		let result = this.filteredResult.length == 0 ? this.manager.repoData : this.filteredResult;
		return result;
	}

	@computed get profileData() {
		return this.manager.profileData;
	}

}


@observer
class InnerView extends React.Component<{ manager: Manager }> {
	private viewModel: ViewModel

	constructor(props) {
		super(props)
		this.viewModel = new ViewModel(props.manager);
	}

	handleInput = (event) =>{
   this.viewModel.handleInput(event.target.value);
	}

	render() {
		return (
			<>
				<div><input type="text" value={this.viewModel.filter} placeholder="find a repository ..." onChange={this.handleInput}></input> </div>
			<div className="wrapper">
				<div className="profile-section">
					<img className="profile-image" src={this.viewModel.profileData.avatar_url} />
					<h1>
						<span className="name-section">{this.viewModel.profileData.name}</span>
						<span className="username-section">{this.viewModel.profileData.login}</span>
					</h1>
					<div className="user-bio">
						<div>{this.viewModel.profileData.bio}</div>
					</div>

					<button className="follow-button">{'Follow'}</button>
					<div className="details">...</div>
					<div className="folowers-section">
						<span><strong>{this.viewModel.profileData.followers}</strong><span className=""> followers</span></span>
						<span><strong>{this.viewModel.profileData.following}</strong><span className=""> following</span></span>
					</div>
					<div >
						<span className="rest-details">{this.viewModel.profileData.company}</span>
						<span className="rest-details">{this.viewModel.profileData.location}</span>
					</div>
				</div>


				<div className="repository-section">
					{this.viewModel.repoData.map((repo)=>(
          <ul key={repo.id}>
						<li className="repo-items">
							<div className="repo-items-details1">
								<h3>
				    	<a className="repo-name" href={repo.html_url}>{repo.name}</a>
								</h3>
							</div>
							<div className="repo-items-details2">
								<div className="star-details"></div>
							</div>
						</li>
					</ul>
					))}
				</div>
			</div>
			</>
		);
	}
};

@observer
class AppView extends React.Component<{ manager: Manager }> {
	private viewModel: ViewModel

	constructor(props) {
		super(props)

	}

	render() {
		return (
			<div >
				<InnerView manager={manager}></InnerView>
			</div>
		);
	}
};


let manager = new Manager()
ReactDOM.render(<AppView manager={manager} />, document.getElementById('root'));
