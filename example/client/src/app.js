import React from 'react';
import { connectGraphQL, mutate } from './store';
import { GraphiQLWithFetcherAndSchema } from './graphiql';

const Editor = React.createClass({
  getInitialState() {
    return {text: ''};
  },

  onSubmit(e) {
    mutate({
      query: '{ addMessage(text: $text) }',
      variables: { text: this.state.text },
    }).then(() => {
      this.setState({text: ''});
    });
  },

  render() {
    return (
      <div>
        <input type="text" value={this.state.text} onChange={e => this.setState({text: e.target.value})} />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  },
});

function deleteMessage(id) {
  mutate({
    query: '{ deleteMessage(id: $id) }',
    variables: { id },
  });
}

let Messages = function(props) {
  return (
    <div>
      {props.data.value.messages.map(({id, text}) => 
        <p key={id}>{text} <button onClick={() => deleteMessage(id)}>X</button></p>
      )}
      <Editor />
    </div>
  );
}
Messages = connectGraphQL(Messages, () => ({
  query: `
  {
    messages {
      id, text
    }
  }`,
  variables: {},
  onlyValidData: true,
}));

function App() {
  if (window.location.pathname === "/graphiql") {
    return <GraphiQLWithFetcherAndSchema />;
  } else {
    return <Messages />;
  }
}

export default App;