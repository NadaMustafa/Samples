import React, {Component} from 'react'
import { Modal, Row, Col, Icon, Carousel } from 'antd'
import './BKModal.css'

export default class BkModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isThumbUpClicked: false,
      isThumbDownClicked: false,
    }
  }
  static getDerivedStateFromProps(nextProps) {
    
    if(nextProps.likes && nextProps.dislikes) {
      return {
        isThumbUpClicked:  nextProps.likes.filter(c => c.choiceId === nextProps.choice.id).length > 0 ? true: false,
        isThumbDownClicked: nextProps.dislikes.filter(c => c.choiceId === nextProps.choice.id).length > 0 ? true: false,
      }
    } else return null
  }

  voteUp = () => {
    this.props.firestore.add(
      { collection: `/polls/${this.props.pollId}/likes` },
      {
        choiceId: this.props.choice.id,
        userId: this.props.userId
      }
    )
  }

  voteDown = () => {
    this.props.firestore.add(
      { collection: `/polls/${this.props.pollId}/dislikes` },
      {
        choiceId: this.props.choice.id,
        userId: this.props.userId
      }
    )
  }

  removeVoteUp = () => {
    const doc = this.props.likes.find(doc => doc.choiceId === this.props.choice.id)
    this.props.firestore.delete(
      { collection: `/polls/${this.props.pollId}/likes`,
        doc: doc.id 
      }
    )
  }
  
  removeVoteDown = () => {
    const doc = this.props.dislikes.find(doc => doc.choiceId === this.props.choice.id)
    this.props.firestore.delete(
      { collection: `/polls/${this.props.pollId}/dislikes`,
        doc: doc.id 
      }
    )
  }
  
  onThumbsUpClick = () => {
    if(this.state.isThumbUpClicked) {
      this.removeVoteUp()
    }
    else if (this.state.isThumbDownClicked) {
      this.removeVoteDown()
      this.voteUp()
    }else{
      this.voteUp()
    } 
  }

  onThumbsDownClick = () => {
    if(this.state.isThumbDownClicked) {
      this.removeVoteDown()
    }else if (this.state.isThumbUpClicked) {
      this.removeVoteUp()
      this.voteDown()
    }else{
      this.voteDown()
    } 
  }

  onAnotherChoiceClicked = (c) => {
    this.props.modalChoiceChanged(c)
  }

  render() {
    return(
      <Modal
        title={this.props.choice.name}
        visible={this.props.isModalVisible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={null}
      >
        <Row type="flex" justify="center">
          <Col>
            <img className="bk-modal__image" alt="example" src={this.props.choice.image} />
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Icon 
            type="like"
            className="bk-modal-thumbs-up"
            theme={this.state.isThumbUpClicked? "twoTone" : "outlined" }
            onClick={this.onThumbsUpClick}/>
          <Icon 
            type="dislike"
            className="bk-modal-thumbs-down"
            theme={this.state.isThumbDownClicked? "twoTone" : "outlined" }
            twoToneColor="red"
            onClick={this.onThumbsDownClick}/>
        </Row>
        
        <Carousel autoplay>
          {
            this.props.choices.map(c =>( 
              <img
                key={c.id}
                className="bk-modal__carousel-image"
                alt="example"
                src={c.image}
                onClick={() => this.onAnotherChoiceClicked(c)}
              />
              )
            )
          }
        </Carousel>
      </Modal>
    )
  }
}