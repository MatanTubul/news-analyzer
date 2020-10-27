import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import React from "react";

export default function NewsTimeSpan({handleFromDateChange,
                                       handleToDateChange,
                                       fromDate,
                                       toDate}) {

  return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid item>
          <KeyboardDatePicker
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="from-date-picker-inline"
              label="From"
              value={fromDate}
              maxDate={toDate}
              onChange={handleFromDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
          />
        </Grid>
        <Grid item>
          <KeyboardDatePicker
              clearable
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="to-date-picker-inline"
              label="To"
              value={toDate}
              minDate={fromDate}
              onChange={handleToDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
          />
        </Grid>
      </MuiPickersUtilsProvider>

  )
}