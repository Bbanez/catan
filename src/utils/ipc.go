package utils

import (
	"encoding/base64"
	"reflect"

	"github.com/bbanez/catan/gen/proto_asset"
	"github.com/bbanez/catan/src/storage"
	"google.golang.org/protobuf/proto"
)

type IpcMessage struct {
	Err   bool   `json:"err"`
	Bytes string `json:"bytes"`
}

func NewIpcMessage(err bool, bytes *[]byte) IpcMessage {
	return IpcMessage{
		Err:   err,
		Bytes: base64.StdEncoding.EncodeToString(*bytes),
	}
}

func NewIpcMessageFromProto[P proto.Message](err bool, data P) IpcMessage {
	bytes, e := PackProto(data)
	if e != nil {
		panic(err)
	}
	return NewIpcMessage(err, &bytes)
}

func BytesFromIpcMessage(message *IpcMessage) (*[]byte, error) {
	bytes, err := base64.StdEncoding.DecodeString(message.Bytes)
	if err != nil {
		return nil, err
	}
	return &bytes, nil
}

func UnpackIpcMessageWithTransorm[P proto.Message, O any](
	message *IpcMessage,
	transform func(data P) (*O, error),
) (*O, *IpcMessage) {
	b, err := BytesFromIpcMessage(message)
	if err != nil {
		return nil, ReturnIpcErrorPtr(400, err.Error())
	}
	data, err := UnpackProtoWithTransform(*b, transform)
	if err != nil {
		return nil, ReturnIpcErrorPtr(400, err.Error())
	}
	return data, nil
}

func UnpackIpcMessage[P proto.Message](
	message *IpcMessage,
) (P, *IpcMessage) {
	b, err := BytesFromIpcMessage(message)
	if err != nil {
		var msg P
		msg = reflect.New(reflect.TypeOf(msg).Elem()).Interface().(P)
		return msg, ReturnIpcErrorPtr(400, err.Error())
	}
	data, err := UnpackProto[P](*b)
	if err != nil {
		return data, ReturnIpcErrorPtr(400, err.Error())
	}
	return data, nil
}

func PackIpcMessage[P proto.Message](data P) IpcMessage {
	b, err := PackProto(data)
	if err != nil {
		return ReturnIpcError(500, err.Error())
	}
	return NewIpcMessage(false, &b)
}

func ReturnAsset(storage *storage.Storage, path string) IpcMessage {
	b, derr := storage.Read(path)
	if derr != nil {
		return ReturnIpcError(500, "Failed to read file: "+derr.Error())
	}
	result := proto_asset.AssetResponse{
		Data: b,
	}
	return PackIpcMessage(&result)
}
