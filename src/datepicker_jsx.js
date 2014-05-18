/** @jsx React.DOM */

goog.provide('misino.ui.datepicker.DatePicker');

var DatePickerUtils = {
    daysInMonthCount: function(month, year) {
        var d =new Date(year, month+1, 0);
        return d.getDate();
    },
    getArrayByBoundary: function(start, end) {
        var out = [];
        for(var i= start; i<=end; i++) {
            out.push(i);
        }
        return out;
    },
    createNewDay:  function(date, time) {
        var newDate = new Date();
        newDate.setTime(time);
        newDate.setDate(date);
        return newDate;
    },
    createNewDayMonth: function(date, month, time) {
        var newDate = new Date();
        newDate.setTime(time);
        newDate.setMonth(month);
        newDate.setDate(date);
        return newDate;
    }
}

var Day = React.createClass({displayName: 'Day',
    handleClick: function(e) {
        e.preventDefault();
        this.props.changeDate(this.props.date);
    },
    getDefaultProps: function() {
        return {selected:false};
    },
    render: function() {
        var className="day week-"+this.props.week+" dayInWeek-"+this.props.date.getDay();
        className += (this.props.selected?' selected':'');
        return (
            React.DOM.div( {className:className}, 
                React.DOM.a( {href:"#", onClick:this.handleClick}, this.props.date.getDate())
            )
            );
    }
});

var DayPicker = React.createClass({displayName: 'DayPicker',
    selectDay: function(date) {
        this.props.selectDate(date);
    },
    render: function (){
        var date=this.props.date,
            beforeDaysCount = DatePickerUtils.daysInMonthCount((date.getMonth()-1), date.getFullYear()),
            firstDay = DatePickerUtils.createNewDay(1, date.getTime()),
            offset = (firstDay.getDay()===0?7:firstDay.getDay())- 1,
            daysArray = DatePickerUtils.getArrayByBoundary(beforeDaysCount-offset+1, beforeDaysCount);

        var previousMonthDays = daysArray.map(function(day){
            var thisDate = DatePickerUtils.createNewDayMonth(day, date.getMonth()-1, date.getTime());
            return Day( {date:thisDate, week:1, changeDate:this.selectDay} )
        }.bind(this));

        daysArray = DatePickerUtils.getArrayByBoundary(1, DatePickerUtils.daysInMonthCount(date.getMonth(), date.getFullYear()));
        var actualMonthDays = daysArray.map(function(day) {
            var thisDate = DatePickerUtils.createNewDay(day, date.getTime()),
                weekNumber = Math.ceil((day+offset) / 7),
                selected = false;

            if(date.getMonth()==this.props.selectedDate.getMonth() && date.getFullYear()==this.props.selectedDate.getFullYear()) {
                selected = (day==this.props.selectedDate.getDate());
            }
            return Day( {selected:selected, date:thisDate, week:weekNumber, changeDate:this.selectDay} )
        }.bind(this));

        daysArray = DatePickerUtils.getArrayByBoundary(1, 42- previousMonthDays.length - actualMonthDays.length);
        var nextMonthDays = daysArray.map(function(day){
            var thisDate = DatePickerUtils.createNewDayMonth(day, date.getMonth()+1, date.getTime()),
                weekNumber = Math.ceil((previousMonthDays.length + actualMonthDays.length + day) / 7);
            return Day( {date:thisDate, week:weekNumber, changeDate:this.selectDay} )
        }.bind(this));

        return (
            React.DOM.div( {className:"datepicker-dates"}, 
                React.DOM.div( {className:"out"}, 
                previousMonthDays
                ),
                React.DOM.div(null, 
                actualMonthDays
                ),
                React.DOM.div( {className:"out"}, 
                nextMonthDays
                )
            )
            );
    }
});

var NumberPicker = React.createClass({displayName: 'NumberPicker',
    getDefaultProps: function() {
        return {number:0};
    },
    changeNumber: function(e) {
        this.props.onChangeNumber(e.target.getAttribute('data-number'));
    },

    render: function() {
        return (
            React.DOM.div( {className:"numberpicker"}, 
                React.DOM.a( {onClick:this.changeNumber, 'data-number':this.props.number-1, className:"btn btn-xs btn-default"}, "<<"),
                React.DOM.span( {className:"btn btn-xs"}, this.props.number),
                React.DOM.a( {onClick:this.changeNumber, 'data-number':this.props.number+1, className:"btn btn-xs btn-default"}, ">>")
            )
            )
    }
});

var DatePicker = React.createClass({displayName: 'DatePicker',
    onChangeVisibleDate: function(date) {
        this.setState({visibleDate:date});
    },
    onChangeSelectedDate: function(date) {
        this.setState({visibleDate:date});
        this.props.onChangeDate(date);
    },
    getDefaultProps: function() {
        return({selectedDate:new Date(), show:true, onChangeDate: function(date) {
            console.log(date);
        }});
    },
    getInitialState: function() {
        var date = new Date();
        date.setTime(this.props.selectedDate.getTime());
        return({visibleDate:date});
    },
    changeYear: function(year) {
        var date = new Date();
        date.setTime(this.state.visibleDate.getTime());
        date.setFullYear(year);
        this.setState({visibleDate:date});
    },
    changeMonth: function(month) {
        var date = new Date();
        date.setTime(this.state.visibleDate.getTime());
        date.setMonth(month-1);
        this.setState({visibleDate:date});
    },
    render: function () {
        var style = {display:(this.props.show?'block':'none')};
        return (
            React.DOM.div( {className:"datepicker", style:style}, 
                React.DOM.div( {className:"datepicker-container"}, 
                    NumberPicker( {number:this.state.visibleDate.getFullYear(), onChangeNumber:this.changeYear} ),
                    NumberPicker( {number:this.state.visibleDate.getMonth()+1, onChangeNumber:this.changeMonth} ),

                    DayPicker( {date:this.state.visibleDate, selectedDate:this.props.selectedDate, changeDate:this.onChangeVisibleDate, selectDate:this.onChangeSelectedDate} )
                )
            )
            );
    }
});

var DatePickerInput = React.createClass({displayName: 'DatePickerInput',
    getDefaultProps: function() {
        return({date:new Date()});
    },
    getInitialState: function() {
        return {show:false};
    },
    showDatePicker: function() {
        this.setState({show:true});
    },
    hideDatePicker: function() {
        this.setState({show:false});
    },
    onChangeDate: function(date) {
        this.props.date = date;
        this.setState({show:false});
    },
    render: function() {
        var style={position:'fixed', top:0,left:0, width:'100%', height:'100%', display:(this.state.show?'block':'none')};

        return (
            React.DOM.div(null, 
                React.DOM.div( {style:style, onClick:this.hideDatePicker}),
                React.DOM.div( {className:"datepicker-wrapper"}, 
                    DatePicker( {selectedDate:this.props.date, show:this.state.show, onChangeDate:this.onChangeDate}  )
                ),
                React.DOM.input( {type:"text", onFocus:this.showDatePicker, value:this.props.date} )
            )
            );
    }
});

goog.exportSymbol('DatePicker', DatePicker);
goog.exportSymbol('DatePickerInput', DatePickerInput);