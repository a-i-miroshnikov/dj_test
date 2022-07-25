import {
  Model1,
  Model2,
  Model3,
  Model4,
  Model5,
  Model6,
  Model7,
  Model8,
  Model9,
  Model10
} from "./models";

const WorkingWindow = ({ModelIsShown}) => {

  return (
    <div className='workingWindow'>
      {ModelIsShown[0] && <Model1/>}
      {ModelIsShown[1] && <Model2/>}
      {ModelIsShown[2] && <Model3/>}
      {ModelIsShown[3] && <Model4/>}
      {ModelIsShown[4] && <Model5/>}
      {ModelIsShown[5] && <Model6/>}
      {ModelIsShown[6] && <Model7/>}
      {ModelIsShown[7] && <Model8/>}
      {ModelIsShown[8] && <Model9/>}
      {ModelIsShown[9] && <Model10/>}
      <br/>
      <br/>
      <br/>
    </div>
  );
}

export {WorkingWindow}