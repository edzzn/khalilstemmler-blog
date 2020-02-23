import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from "gatsby"
import { WikiContainer } from '../../wiki'
import { getWikisFromQuery } from '../../../utils/wiki'
import { Link } from 'gatsby'
import arrowForward from '../../../images/icons/arrow-forward.svg'

const RecentWikiEdits = ({ wikis }) => (
  <WikiContainer
    titleText="Recently Edited Wikis"
    subTitleComponent={(
      <Link className="navigation-link" to="/wiki">view all <img src={arrowForward}/></Link>
    )}
    wikis={wikis}
  />
)

export default () => (
  <StaticQuery
    query={graphql`
      query RecentWikiEdits {    
        wikis: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___updated] }
          filter: {
            frontmatter: {
              templateKey: { eq: "wiki" }
              published: { eq: true }
            }
          }
          limit: 2
        ) {
          edges {
            node {
              id
              html
              excerpt(pruneLength: 160)
              fields {
                slug
                readingTime {
                  text
                }
              }
              frontmatter {
                date
                updated
                wikitags
                name
                prerequisites
                wikicategory
                plaindescription
              }
            }
          }
        }
      }
    `}
    render={data => {
      return (
        <RecentWikiEdits
          wikis={getWikisFromQuery(data.wikis)}
        />
      )
    }}
  />
)