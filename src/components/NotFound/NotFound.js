//libs
import React from 'react'
import { TPPageNotFound } from '../TPPageNotFound/TPPageNotFound'
//src

//scss
import './NotFound.css'

const NotFound = ({ message, src }) => {
  return (
    <>
      <div className="not-found-main-container">
        <TPPageNotFound
          src={src ?? process.env.PUBLIC_URL + '/images/errorImg.png'}
          message={message ?? 'Page Not Found!'}
          linkText="Return To Home"
          // onClick={() => history.push("/")}
          width={window.screen.width < 700 ? '100%' : '50%'}
        />
      </div>
    </>
  )
}

export default NotFound
