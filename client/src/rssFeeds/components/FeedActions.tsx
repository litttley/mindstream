import * as React from "react"
import * as styles from "./FeedActions.css"
import { FeedAction } from "./FeedAction"
import { NextIcon } from "~/components/icons/NextIcon"
import { PreviousIcon } from "~/components/icons/PreviousIcon"

interface Props {
  previusLoading?: boolean
  nextLoading: boolean
  onPrevious: () => void
  onNext: () => void
}

export function FeedActions({ previusLoading  = false, nextLoading, onNext, onPrevious }: Props) {
  return (
    <div className={styles.container}>
      <FeedAction
        className={styles.actionPrevious}
        icon={<PreviousIcon />}
        loading={previusLoading}
        onClick={onPrevious}
      />
      <FeedAction
        className={styles.actionNext}
        icon={<NextIcon />}
        loading={nextLoading}
        onClick={onNext}
      />
    </div>
  )
}
