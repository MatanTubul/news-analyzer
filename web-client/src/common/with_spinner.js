import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginLeft: '50%',
    marginTop: '10%'
  },
}));

export default function WithSpinner(Component) {
  const classes = useStyles();
  return function WithLoading(props) {
    return(
        props.isLoading ?
            <div className={classes.root}>
              <CircularProgress />
            </div>
            : <Component  {...props}/>
    )
  }
}