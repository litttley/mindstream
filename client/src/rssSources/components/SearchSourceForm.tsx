import * as React from "react"
import * as styles from "./SearchSourceForm.css"

interface Props {
  disable: boolean
  onChange: (value: string) => void
}

interface State {
  query: string
}

export default class SearchSourceForm extends React.Component<Props, State> {
  state = {
    query: ""
  }

  render() {
    const { query } = this.state
    return (
      <div className={styles.searchSourceForm}>
        <label className={styles.title}>Search new rss sources</label>
        <div className={styles.search}>
          <input
            className={styles.input}
            type="search"
            value={query}
            placeholder="Search"
            onChange={this.onChangeHandler}
          />
        </div>
      </div>
    )
  }

  onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const query = event.currentTarget.value
    this.setState({ query })
    onChange(query)
  }
}
