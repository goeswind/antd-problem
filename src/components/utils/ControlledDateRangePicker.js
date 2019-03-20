import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import myutil from '../../utils/myutil';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default class ControlledDateRangePicker extends PureComponent {
  state = {
  mode: ['date', 'date'],
  value: [],
	startNY: '',
  endNY: '',
  isOne:1,
  };

  componentWillMount() {
	  let arr = myutil.date.getPrevMonthArr();
	  this.setState({value: arr});
	  this.props.onChange(arr,this.state.isOne);
	  this.setState({isOne: 2})  
  }

  componentDidMount() {
	if(this.props.onRef)
		this.props.onRef(this); 
  }

  reset() {
	let arr = myutil.date.getPrevMonthArr();
	this.setState({value: arr});
	//this.props.onChange(arr);
  }

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [
        mode[0] === 'date' ? 'date' : mode[0],
        mode[1] === 'date' ? 'date' : mode[1],
      ],
    });
  this.props.onChange(value); 
  }

  render() {
    const { value, mode } = this.state;
    return (
      <RangePicker
        placeholder={['起始年月', '结束年月']}
        format="YYYY-MM-DD"
        value={value}
        mode={mode}
	    	style={{width:'250px'}}
        onChange={this.handlePanelChange}
      />
    );
  }
}