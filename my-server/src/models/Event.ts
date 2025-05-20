import mongoose, { Schema, Document } from 'mongoose';
import { isValidDate } from '../utils/validators';

/**
 * Interface representing an Event document in MongoDB
 */
export interface IEvent extends Document {
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema definition for the Event model
 */
const EventSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, '일정 제목은 필수입니다'],
      trim: true,
      minlength: [2, '제목은 최소 2자 이상이어야 합니다'],
      maxlength: [100, '제목은 100자 이내여야 합니다']
    },
    description: { 
      type: String,
      trim: true,
      maxlength: [500, '설명은 500자 이내여야 합니다']
    },
    startDateTime: { 
      type: Date, 
      required: [true, '시작 일시는 필수입니다'],
      validate: {
        validator: function(value: Date) {
          return isValidDate(value);
        },
        message: '유효하지 않은 시작 일시입니다'
      }
    },
    endDateTime: { 
      type: Date,
      validate: [
        {
          validator: function(value: Date) {
            if (!value) return true; // Optional field
            return isValidDate(value);
          },
          message: '유효하지 않은 종료 일시입니다'
        },
        {
          validator: function(this: IEvent, value: Date) {
            // Only validate if endDateTime is provided
            if (!value) return true;
            // Check that endDateTime is after startDateTime
            return value > this.startDateTime;
          },
          message: '종료 일시는 시작 일시보다 이후여야 합니다'
        }
      ]
    }
  },
  { timestamps: true }
);

// 특정 달의 일정을 조회하기 위한 인덱스 생성
EventSchema.index({ startDateTime: 1 });

// 월별 조회를 위한 가상 필드 추가
EventSchema.virtual('month').get(function(this: IEvent) {
  return this.startDateTime.getMonth() + 1; // 0-based to 1-based
});

EventSchema.virtual('year').get(function(this: IEvent) {
  return this.startDateTime.getFullYear();
});

// JSON 변환 시 가상 필드 포함
EventSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// 저장 전 데이터 정규화 미들웨어
EventSchema.pre('save', function(next) {
  // 타이틀 앞뒤 공백 제거
  if (this.title) {
    this.title = this.title.trim();
  }
  
  // 설명 앞뒤 공백 제거
  if (this.description) {
    this.description = this.description.trim();
  }
  
  next();
});

const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event;