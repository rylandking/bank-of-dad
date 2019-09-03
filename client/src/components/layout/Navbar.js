import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ title, icon }) => {
  return (
    <Fragment>
      <nav className='light-blue accent-3'>
        <div class='nav-wrapper'>
          <ul className='left'>
            <Link
              href='/'
              data-target='slide-out'
              className='sidenav-trigger show-on-large'
            >
              <i className='material-icons'>sort</i>
            </Link>
          </ul>
          <Link to='/' className='brand-logo center'>
            <i className='material-icons'>local_atm</i>
          </Link>
          <ul className='right'>
            <li>
              <Link to='/'>
                <i class='material-icons'>account_circle</i>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <ul id='slide-out' className='sidenav'>
        <h3>Kids</h3>
        <li>
          <Link to='/'>Joey</Link>
        </li>
        <li>
          <Link to='/'>Janelle</Link>
        </li>
        <li>
          <Link to='/'>Jamie</Link>
        </li>
        <li>
          <Link className='btn deep-purple accent-2 waves-effect waves-light'>
            Add Kid
          </Link>
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
