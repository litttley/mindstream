import * as React from "react"
import * as styles from "./SearchSourceForm.css"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface Props {
  disable: boolean
  onChange: (value: string) => void
}

interface State {
  query: string
}

class SearchSourceForm extends React.Component<Props & InjectedIntlProps, State> {
  state = { query: "" }

  render() {
    const { intl } = this.props
    const { query } = this.state
    return (
      <div className={styles.searchSourceForm}>
        <label className={styles.title}>{intl.formatMessage({ id: "searchNewRssSources" })}</label>
        <div className={styles.search}>
          <input
            className={styles.input}
            type="search"
            value={query}
            placeholder={intl.formatMessage({ id: "search" })}
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

export default injectIntl(SearchSourceForm)
