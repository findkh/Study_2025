import React, { useState } from "react";
import { Upload, message, Button, List, Modal } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { UploadDiv } from "./Waveform.styled";
import Waveform from "./Waveform";

// File 타입 확장 (status 속성 추가)
interface CustomFile extends UploadFile {
  uid: string;
  status: "done" | "uploading" | "error"; // 상태를 명시적으로 설정
}

const DragAndDrop: React.FC = () => {
  const [file, setFile] = useState<CustomFile | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const beforeUpload = (newFile: File) => {
    const isAudio = newFile.type.startsWith("audio/");
    if (!isAudio) {
      message.error("You can only upload audio files!");
      return false; // 파일 업로드를 진행하지 않음
    }

    // 이미 파일이 존재하는 경우에만 확인 모달 띄우기
    if (file) {
      Modal.confirm({
        title: "Overwrite File?",
        content: "You already have an uploaded file. Do you want to replace it?",
        onOk: () => {
          const url = URL.createObjectURL(newFile);
          setFile({
            ...newFile,
            uid: `${newFile.name}-${new Date().getTime()}`, // 고유 uid 생성
            status: "done",
            name: newFile.name,
          });
          setAudioURL(url);
        },
        onCancel: () => {
          return false; // 파일 업로드 취소
        },
      });
      return false; // 자동 업로드 방지
    } else {
      const url = URL.createObjectURL(newFile);
      setFile({
        ...newFile,
        uid: `${newFile.name}-${new Date().getTime()}`, // 고유 uid 생성
        status: "done",
        name: newFile.name,
      });
      setAudioURL(url);
      return false; // 자동 업로드 방지
    }
  };

  const handleRemove = () => {
    setFile(null); // 파일 제거 시 상태 초기화
    setAudioURL(null); // 오디오 URL 초기화
  };

  return (
    <div>
      <h1>File Upload with Drag and Drop</h1>
      <UploadDiv>
        <Upload.Dragger
          name="file"
          listType="text"
          fileList={file ? [file] : []} // 하나의 파일만 리스트로 관리
          beforeUpload={beforeUpload}
          showUploadList={false} // 리스트를 숨깁니다.
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support only audio files. (Max file size: 2MB)</p>
        </Upload.Dragger>
        {file && (
          <List
            bordered
            dataSource={[file]} // 파일 하나만 표시
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button icon={<DeleteOutlined />} onClick={handleRemove} danger>
                    Delete
                  </Button>,
                ]}
              >
                {item.name}
              </List.Item>
            )}
          />
        )}
        {audioURL && <Waveform audioURL={audioURL} />}
      </UploadDiv>
    </div>
  );
};

export default DragAndDrop;
