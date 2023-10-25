//libs
import React from 'react'

//src

//scss
import './TPPageNotFound.css'

export const TPPageNotFound = ({
  src,
  message,
  onClick,
  linkText,
  width = '50%',
  ...rest
}) => {
  return (
    <>
      <div className="fae--page-not-found-main-container" {...rest}>
        <img
          style={{
            width: '100%',
            display: 'flex',
            alignmentBaseline: 'middle',
            justifyContent: 'center',
            marginTop: '52%',
          }}
          width={width}
          height="auto"
          src={src}
          alt={src}
        />
        {/* <h3 heading>{message}</h3> */}
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            top: '-50px',
            backgroundColor: 'red',
            zIndex: '999',
            width: '33%',
            display: 'block',
            margin: 'auto',
            borderRadius: '23px',
            padding: '2px',
            fontSize: '11px',
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          {linkText}
        </p>
      </div>
    </>
  )
}
