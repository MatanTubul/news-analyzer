import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import SourcesList from "./sources";
import NewsTimeSpan from "./news_feed_timespan";
import ReactWordsCloud from 'react-wordcloud';
import WithSpinner from "../../common/with_spinner";
const axios = require('axios')

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  wordsCloud: {
    marginTop: '5%'
  }
}));

//WordsCloud options
const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [10, 60],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,

  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean"
};


function LoaderPanel() {
  const WorldsCloud = WithSpinner(ReactWordsCloud)
  const classes = useStyles();
  // The first commit of Material-UI
  const [source, setSource] = React.useState('bbc-news');
  const [fromDate, setFromDate] = useState(new Date(Date.now()))
  const [toDate, setToDate] = useState(new Date(Date.now()))
  const [wordsCloud, setWordsCloud] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    setSource(event.target.value);
    setWordsCloud([])
  };

  /**
   * handle from date  picker
   * @param date Object
   */
  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  /**
   * handle to date  picker
   * @param date Object
   */
  const handleToDateChange = (date) => {
    setToDate(date);
  };
  const handleLoad = () => {
    setIsLoading(true)
    axios.get('/api/news/load', {
      params: {
        source,
        fromDate,
        toDate
      }
    }).then(res => {
      if(res.data.words) {
        setWordsCloud(res.data.words)
      }
    }).catch(err => {
      console.log(err)
    }).finally(()=>setIsLoading(false))
  }
  return (
      <div className={classes.root}>
        <Paper>
          <Grid container direction="row" wrap="nowrap"
                spacing={3}
                alignItems="center"
                justify={"center"}
                style={{marginBottom: '2px', width:'100%'}}>
            <Grid item >
              <SourcesList source={source}
                           handleChange={handleChange}/>
            </Grid>
              <NewsTimeSpan handleFromDateChange={handleFromDateChange}
                            handleToDateChange={handleToDateChange}
              fromDate={fromDate}
              toDate={toDate}/>

            <Grid item >
              <Button variant="contained" color="primary" onClick={handleLoad}>
                Load
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <WorldsCloud words={wordsCloud}
                     options={options}
                     size={[1500, 500]}
                     isLoading={isLoading}
                     className={classes.wordsCloud}/>
      </div>

  );
}
export default LoaderPanel