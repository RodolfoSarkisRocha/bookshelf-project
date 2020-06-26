// React
import React from 'react';

// Styles
import './TopNav.scss';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

export default props => {

	const mobileDisplay = window.innerWidth < 768;

	return (
		<>
			{
				!mobileDisplay &&
				<nav className='desktop-nav'>
					<div id='nav-links' className='links-container'>
						<Link className='link-style' to='/'>Home</Link>
						<Link className='link-style' to='/category'>Category</Link>
					</div>
				</nav>
			}
			{
				mobileDisplay &&
				<nav className='mobile-nav'>
					<Link className='bottom-nav-item' to='/'>
						<FontAwesomeIcon className='bottom-nav-icon' icon={['fas', 'home']} />
						<div>Home</div>
					</Link>
					<Link className='bottom-nav-item' to='/category'>
						<FontAwesomeIcon className='bottom-nav-icon' icon={['fas', 'list-ul']} />
						<div>Category</div>
					</Link>
				</nav>
			}
		</>
	);
};