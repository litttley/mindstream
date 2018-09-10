import { AppAction } from "app/AppActions"
import { MindstreamAction } from "mindstream/MindstreamActions"
import { SourcesAction } from "rssSources/SourcesActions"
import { FeedsAction } from "feeds/FeedsActions"
import { AuthAction } from "auth/AuthActions"

export type Actions =
  MindstreamAction |
  AppAction |
  SourcesAction |
  FeedsAction |
  AuthAction
