import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey: 'ac3be7cb74874d4a8df474b4d221f706'
})

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route:'signin',
      isSigned:false,
      user:{
        id:'',
        name:'',
        email: '',
        entries: 0,
        joined: ''

      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user:{
        id : data.id,
        name : data.name,
        email : data.email,
        entries : data.entries,
        joined : data.joined
      }
    })
  }


  calculateFaceBox = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onRouteChange = (string) => {
    if (string === 'home')
    {
      this.setState({isSigned:true});
      this.setState({route:string})
    }
    else if (string === 'signout')
    {   
      this.setState({isSigned:false})
      this.setState({route:'signin'});
    }
    else
    this.setState({route:string});
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => {
      if (response){
        fetch('http://localhost:3001/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then((count) => {
          this.setState(Object.assign(this.state.user,{ entries:count }))
        })

      }
      this.displayFaceBox(this.calculateFaceBox(response))
      })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Navigation onRouteChange = {this.onRouteChange} isSigned = {this.state.isSigned}/>
        { this.state.route ==='home'
          ? <div>
              <Logo />
              <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl = {this.state.imageUrl}/>
            </div>
          : (
              this.state.route ==='signin'
              ? <Signin onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
              : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
