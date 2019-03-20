import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import myutil from '../../utils/myutil';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default class ControlledRangePicker extends PureComponent {
  state = {
    mode: ['month', 'month'],
    value: [],
	startNY: '',
	endNY: '',
  };

  componentWillMount() {
	let arr = myutil.date.getPrevMonthArr();;
	this.setState({value: arr});
	this.props.onChange(arr);
  }

  componentDidMount() {
	if(this.props.onRef)
		this.props.onRef(this); 
  }

  reset() {
	let arr = myutil.date.getPrevMonthArr();;
	this.setState({value: arr});
	//this.props.onChange(arr);
  }

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    });

	this.props.onChange(value);
  }

  render() {
    const { value, mode } = this.state;
    return (
      <RangePicker
        placeholder={['起始年月', '结束年月']}
        format="YYYY-MM"
        value={value}
        mode={mode}
		style={{width:'200px'}}
        onPanelChange={this.handlePanelChange}
      />
    );
  }
}