import React, { Component  } from 'react'
class Modal extends Component {
    render() {
        // console.log("index: " , this.props.index)
        return (
            <div class="modal fade" id={this.props.modalName} tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">{this.props.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {this.props.body}
                        </div>
                        <div class="modal-footer">
                            <button type="button" id = {"closeModal"} class="btn btn-secondary" data-dismiss="modal">{this.props.closeButton}</button>
                            {this.props.saveButton?<button type="button" class="btn btn-primary">{this.props.saveButton}</button>:<div></div>}
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Modal