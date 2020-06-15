// Imports statements
import React, { useState } from 'react';
import './TopNav.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

export default props => {

	const [showMobileLinks, setMenuIcon] = useState(false);

	const menuIconClass = new Map([
		[true, 'vertical-bars'],
		[false, 'horizontal-bars']
	]);

	const handleLinksView = () => {
		// Changing the links display depending on the display size
		const linksContainer = document.getElementById('nav-links');
		if (linksContainer.className === 'links-container') linksContainer.className += ' responsive-links';
		else linksContainer.className = 'links-container';

		setMenuIcon(!showMobileLinks)
	}

	return (
		<nav>
			<div id='nav-links' className='links-container'>
				<Link className='link-style' to='/'>Home</Link>
				<Link className='link-style' to='/category'>Category</Link>
				<Link className='last-link-style' to='/book'>Book</Link>
			</div>
			<div className='menu-icon'>
				<Link onClick={handleLinksView}>
					<FontAwesomeIcon
						icon={['fas', 'bars']}
						className={menuIconClass.get(showMobileLinks)}
					/>
				</Link>
			</div>
		</nav>
	);
};