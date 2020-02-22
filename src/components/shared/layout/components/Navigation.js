
import React from 'react'
import PropTypes from 'prop-types'
import MobileNavigation from '../../mobile-navigation'
import "../styles/Navigation.sass"
import icon from '../../../../images/icons/mystery-icon-white.svg'
import NavLink from './NavLink'
import booksImg from '../../../../images/nav/books.png';
import newsletterImg from '../../../../images/nav/newsletter.png';
import { colors } from '../../../../assets/colors'

const RetroBars = () => (
  <div className="retro-bars">
    {Object.keys(colors.retro).map((c) => (
      <div style={{
        backgroundColor: colors.retro[c]
      }}></div>
    ))}
  </div>
)

const Logo = () => (
  <a className="logo" href="https://khalilstemmler.com/">
    <img src={icon} />
    <p>khalilstemmler.com</p>
  </a>
)

const Links = () => (
  <div className="links">
    <NavLink to="/courses" displayValue="Courses" />
    <NavLink to="/articles" displayValue="Articles" />
    <NavLink
      to="/books"
      displayValue="Resources"
      dropdownTitle="All resources"
      dropdownLinks={[
        {
          icon: booksImg,
          to: '/books',
          displayValue: 'Books',
          description: "Things you read to get smart"
        },
        {
          icon: newsletterImg,
          to: '/newsletter',
          displayValue: 'Newsletter',
          description: `Get notified when new content comes out`
        }
      ]}
    />
    <NavLink to="/wiki" displayValue="Wiki" />
  </div>
)

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
    }

    this.navOnScroll = this.navOnScroll.bind(this);
  }

  componentDidMount() {
    typeof window !== 'undefined'
      && window.addEventListener('scroll', this.navOnScroll)
  }

  componentWillUnmount() {
    typeof window !== 'undefined'
      && window.removeEventListener('scroll', this.navOnScroll)
  }

  navOnScroll() {
    if (window.scrollY > 20) {
      this.setState({ scrolled: true })
    } else {
      this.setState({ scrolled: false })
    }
  }

  render() {
    const { rawMode } = this.props;
    const { scrolled } = this.state;

    return (
      <>
        <MobileNavigation
          topOffset={scrolled ? '16px' : '27px'}
        />

        {!rawMode ? <div
          className={scrolled ? "navigation scroll" : "navigation"}>
          <div className="navigation-inner">
            <Logo/>
            <Links/>
          </div>
          <RetroBars />
        </div> : ''}
        
      </>
    )
  }
}

export default Navigation;

Navigation.propTypes = {
  rawMode: PropTypes.bool
}