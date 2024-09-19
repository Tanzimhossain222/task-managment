import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  id: 'someid',
  email: 'test@test.com',
  password: 'password',
  tasks: [],
} as unknown as User;

describe('TaskService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();
    taskService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    const mockTask = {
      title: 'Test task',
      description: 'Test desc',
      id: 'someid',
      status: TaskStatus.OPEN,
    };

    it('calls TaskRepository.findOne() and successfully retrieve and return the task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('someid', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne() and handles Error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('someid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('successfully creates a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      tasksRepository.createTask.mockResolvedValue('someTask');

      const result = await taskService.createTask(createTaskDto, mockUser);
      expect(tasksRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual('someTask');
    });
  });

  describe('deleteTask', () => {
    it('successfully deletes a task', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });

      await taskService.deleteTask('someid', mockUser);
      expect(tasksRepository.delete).toHaveBeenCalledWith({
        id: 'someid',
        user: mockUser,
      });
    });

    it('throws an error if the task is not found', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });

      expect(taskService.deleteTask('someid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('successfully updates task status', async () => {
      const mockTask = {
        status: TaskStatus.OPEN,
      };

      taskService.getTaskById = jest.fn().mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue(mockTask);

      const result = await taskService.updateTaskStatus(
        'someid',
        TaskStatus.DONE,
        mockUser,
      );

      expect(taskService.getTaskById).toHaveBeenCalledWith('someid', mockUser);
      expect(mockTask.status).toEqual(TaskStatus.DONE);
      expect(tasksRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });
});
