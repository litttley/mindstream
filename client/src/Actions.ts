import { RouterAction } from "react-router-redux"
import { AppAction } from "app/AppActions"
import { MindStreamAction } from "mindstream/MindStreamActions"
import { SourcesAction } from "rssSources/SourcesActions"
import { FeedsAction } from "feeds/FeedsActions"
import { AuthAction } from "auth/AuthActions"

export type Actions =
  RouterAction |
  AppAction |
  MindStreamAction |
  SourcesAction |
  FeedsAction |
  AuthAction
