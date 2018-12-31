import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import BkModal from "./BkModal"

export default compose(
  firestoreConnect(),
  connect((state, props) => ({
    likes: state.firestore.ordered.likes,
    dislikes: state.firestore.ordered.dislikes
  }))
)(BkModal)


