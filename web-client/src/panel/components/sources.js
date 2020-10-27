import React, {useEffect, useState} from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

const axios = require('axios')

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SourcesList({handleChange, source}) {
  const classes = useStyles();
  const [sources, setSources] = useState([{id: 'bbc-news', name: 'BBC News'}])
  useEffect(() => {
      axios.get('/api/news/sources').then(res => {
        if(res.data.message) {
          setSources(res.data.message)
        }
      })
  }, [])

  return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select-source-label">Source</InputLabel>
        <Select
            labelId="select-outlined-label"
            id="select-source-outlined"
            value={source}
            onChange={handleChange}
            label="Sources"
            defaultValue={{id:'bbc-news'}}
        >
          {sources.map(source =>
            (<MenuItem value={source.id}>{source.name}</MenuItem>)
          )}
        </Select>
      </FormControl>
  )
}