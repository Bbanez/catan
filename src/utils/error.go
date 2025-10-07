package utils

import (
	"github.com/bbanez/catan/gen/proto_error"
	"google.golang.org/protobuf/proto"
)

func ReturnIpcError(code uint32, message string) IpcMessage {
	data := proto_error.IpcError{
		Code:    code,
		Message: message,
	}
	b, err := proto.Marshal(&data)
	if err != nil {
		panic(err)
	}
	result := NewIpcMessage(true, &b)
	return result
}

func ReturnIpcErrorPtr(code uint32, message string) *IpcMessage {
	data := ReturnIpcError(code, message)
	return &data
}
