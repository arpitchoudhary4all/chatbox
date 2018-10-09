import React from 'react'

export class SendMessageForm extends React.Component {

    constructor(){
        super()
        this.state = {
            message : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleForm = this.handleForm.bind(this);
    }

    handleChange(e){
        this.setState({
            message : e.target.value    
        })
    }

    handleForm(e){
        e.preventDefault();
        console.log(this.state.message);
        this.props.sendMessage(this.state.message);
        this.setState({
            message : ''
        })
    }

    render() {
        return (
            <form onSubmit={this.handleForm} className="send-message-form">
                <input
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}