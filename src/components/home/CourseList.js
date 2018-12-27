import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import CourseCard from './CourseCard'

const styles = theme => ({
  root: {
    width: '100%',
    margin: '0 auto'
  }
})

const CourseList = ({ courses, classes: s }) => {
  const courseList = courses.map((course, index) => {
    if (course.published === false) {
      return null
    }
    return <CourseCard key={course.id} course={course} />
  })

  return (
    <div className={s.root}>
      <Grid container spacing={32}>
        {courseList}
      </Grid>
    </div>
  )
}

CourseList.propTypes = {
  courses: PropTypes.array.isRequired
}

export default withStyles(styles)(CourseList)
