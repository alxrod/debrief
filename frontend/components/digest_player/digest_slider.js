import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { slider } from '@material-tailwind/react';


function valuetext(value) {
  return `${value}min`;
}

const DebriefSlider = styled(Slider)({
  color: '#1C6D3A',
  height: 6,
  '& .MuiSlider-track': {
    border: 'none',
    padding: 0,
  },
  '& .MuiSlider-thumb': {
    height: 15,
    width: 15,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    borderRadius: '15% 15% 15% 15%',
    backgroundColor: '#1C6D3A',
  },
});


const SliderWrapper = (props) => {
  const [sliderStart, setSliderStart] = useState(0)



  return (
    <div className="px-6 w-full mb-[-10px]">
      <DebriefSlider
        defaultValue={Math.min(10,props.maxSize)}
        onChange={(e, v, t) => props.setDigestSize(v)}
        getAriaValueText={valuetext}
        step={1}
        marks
        min={1}
        max={Math.min(50,props.maxSize)}
        valueLabelDisplay="auto"
      />
    </div>
  )
}



export default SliderWrapper