import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ title, icon }) => {
  return (
    <Fragment>
      <nav className='light-blue accent-3'>
        <div class='nav-wrapper'>
          <ul className='left'>
            <a
              href='/'
              data-target='slide-out'
              className='sidenav-trigger show-on-large'
            >
              <i className='material-icons'>sort</i>
            </a>
          </ul>
          <a href='/' className='brand-logo center'>
            <i className='material-icons'>local_atm</i>
          </a>
          <ul className='right'>
            <li>
              <a href='/'>
                <i class='material-icons'>account_circle</i>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <ul id='slide-out' className='sidenav'>
        <h3>
          <b>Kids</b>
        </h3>
        <li>
          <a href='/'>Joey</a>
        </li>
        <li>
          <a href='/'>Janelle</a>
        </li>
        <li>
          <a href='/'>Jamie</a>
        </li>
        <li>
          <a className='btn deep-purple accent-2 waves-effect waves-light'>
            Add Kid
          </a>
        </li>
      </ul>
    </Fragment>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

Navbar.defaultProps = {
  title: 'Bank of Dad',
  icon: 'fas fa-piggy-bank'
};

export default Navbar;
