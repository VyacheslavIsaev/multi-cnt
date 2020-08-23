import React, { Component } from 'react';
import axios from 'axios' ;

class Fib extends Component{
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    async fetchValues(){
        const values = await axios.get('/api/values/current');
        this.setState({values: values.data});
    }

    async fetchIndexes(){
        const seenIndicies = await axios.get('/api/values/all');
        this.setState({
            seenIndexes: seenIndicies.data
        });
    }

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    renderSeenIndexes(){
        return this.state.seenIndexes.map(({number}) => number).join(", ");
    }

    renderValues(){        
        //return this.state.values.map((key, value));
        const entries=[];
        for(let key in this.state.values){
            entries.push(
            <div key={key}>
                For index {key} result: {this.state.values[key]} 
            </div>
            );
        }
        return entries;
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: ''});
    }

    render(){
        return(
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <label>Enter your index:</label>
                    <input 
                        value={this.state.index} 
                        onChange={ event => this.setState({ index: event.target.value})}
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have seen:</h3>
                { this.renderSeenIndexes() }
                <h3>Calcualted Values:</h3>
                { this.renderValues() }
            </div>            
        );    
    }
}

export default Fib;