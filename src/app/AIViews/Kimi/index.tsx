import type { AIDialog, UserDialog } from '../withDialogWrapper'
import { withDialogWrapper } from '../withDialogWrapper'

const UserDialog: UserDialog = (props) => {
  return '真在做了'
}

const AIDialog: AIDialog = UserDialog

const Kimi = withDialogWrapper(UserDialog, AIDialog)

export default Kimi
