import mongoose from "mongoose";

export interface IEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "일정 제목은 필수입니다"],
      trim: true,
      maxlength: [100, "일정 제목은 100자 이내여야 합니다"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "일정 설명은 500자 이내여야 합니다"],
    },
    startDate: {
      type: Date,
      required: [true, "시작 일시는 필수입니다"],
    },
    endDate: {
      type: Date,
      required: [true, "종료 일시는 필수입니다"],
    },
  },
  {
    timestamps: true,
  }
);

// 특정 달의 일정을 조회하기 위한 인덱스 생성
eventSchema.index({ startDate: 1 });

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
