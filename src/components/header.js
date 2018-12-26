import React from 'react'
import { Link } from 'gatsby'

export default () => (
  <div>
    <Link to="/" activeStyle={{ color: 'green' }}>
      home
    </Link>
    <br />
    <Link to="/about" activeStyle={{ color: 'red' }}>
      about
    </Link>
  </div>
)
