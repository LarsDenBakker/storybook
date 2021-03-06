import PropTypes from 'prop-types';
import React from 'react';

import styled from 'react-emotion';
import debounce from 'lodash.debounce';

const base = {
  boxSizing: 'border-box',
  height: '25px',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
};

const TextInput = styled('input')(base, {
  display: 'table-cell',
  width: '100%',
  verticalAlign: 'middle',
});
const RangeInput = styled('input')(base, {
  display: 'table-cell',
  flexGrow: 1,
});
const RangeLabel = styled('span')({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});
const RangeWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

class NumberType extends React.Component {
  constructor(props) {
    super(props);
    let { value } = props.knob;
    if (value === null || value === undefined) {
      value = '';
    }
    this.state = { value };

    this.onChange = debounce(props.onChange, 400);
  }

  componentWillUnmount() {
    this.onChange.cancel();
  }

  handleChange = event => {
    const { value } = event.target;

    this.setState({ value });

    let parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || value === '') {
      parsedValue = null;
    }

    this.onChange(parsedValue);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return knob.range ? (
      <RangeWrapper>
        <RangeLabel>{knob.min}</RangeLabel>
        <RangeInput
          id={knob.name}
          value={value}
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          onChange={this.handleChange}
        />
        <RangeLabel>{`${value} / ${knob.max}`}</RangeLabel>
      </RangeWrapper>
    ) : (
      <TextInput
        id={knob.name}
        value={value}
        type="number"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={this.handleChange}
      />
    );
  }
}

NumberType.defaultProps = {
  knob: {},
  onChange: value => value,
};

NumberType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = value => (value === null || value === undefined ? '' : String(value));
NumberType.deserialize = value => (value === '' ? null : parseFloat(value));

export default NumberType;
