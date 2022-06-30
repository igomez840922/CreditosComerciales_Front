import React from 'react'
import Alert from 'react-bootstrap/Alert'

/*
export default class ErrorHandler extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      this.setState({
        error: error,
        errorInfo: errorInfo
      })
      // You can also log error messages to an error reporting service here
    }
    
    render() {
      if (this.state.errorInfo) {
        // Error path
        return (
          <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </div>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }


<React.ErrorFallbackUI {...{ error, errorMessage }} /> 
  */

      
export default class ErrorHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false,error:"",errorInfo: "" };
    }

    componentDidCatch(error, info) {        
        console.log("componentDidCatch error",error);
        console.log("componentDidCatch errorInfo",info);
        
        this.setState({
        	hasError: true,
            error:error.toString(),
            errorInfo: info.componentStack
        })
    }

    
    static getDerivedStateFromError(error) {
        return { error: error.toString() };
      }
    
      render() {
        if (this.state.hasError) {
            // Render error message or component
            //variant={msgData.isError ? "danger" : "success"}
            return 
            <Alert show={this.state.hasError} variant={"danger"}  dismissible onClose={() => { this.setState({
                hasError: false,
                error:"",
                errorInfo: ""
            }) }}>
                {this.error}
            </Alert>            
        }
        return this.props.children
    }

}
