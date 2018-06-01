import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange,onButtonSubmit}) =>{
	return (
		<div>
			<p className = 'f3'>
				Input the URL of the picture to detect whether there is a face inside the picture
			</p>
			<div className = 'center'>
				<div className = 'linkCenter pa4 br3 shadow-5'>
					<input className = 'f4 pa2 w-100 ' type = 'text' onChange={onInputChange}/>
					<button className = 'w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick = {onButtonSubmit}> Detect </button>
				</div>
			</div>
		</div>
	);
}


export default ImageLinkForm;