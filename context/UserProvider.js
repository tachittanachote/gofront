import React, { Component } from 'react'
import axios from 'axios';
import _ from 'lodash';
import { Preload } from '../components';

const UserContext = React.createContext()

class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: {},
    }
  }

  componentDidMount = () => {
    axios.post('/user').then((e) => {
      this.setState({ user: e.data, isAuthenticated: !_.isEmpty(e.data) });
    }).catch((e) => {
      console.log(e)
    })
  }

  render() {
    return (
      <>
        {!_.isEmpty(this.state.user) ?
          <UserContext.Provider value={{ user: this.state.user }}>
            {this.props.children}
          </UserContext.Provider>
        :
          <Preload></Preload>
        }

      </>
    )
  }
}

export default UserContext

export { UserProvider }