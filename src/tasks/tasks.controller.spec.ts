import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const mockTasksService = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

const mockUser = {
  id: 'someid',
  email: 'test@test.com',
  password: 'password',
  tasks: [],
} as unknown as User;

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useFactory: mockTasksService,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: () => true }) // Bypass AuthGuard for tests
      .compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  describe('getTasks', () => {
    it('should get tasks from the service', async () => {
      tasksService.getTasks.mockResolvedValue('someTasks');
      const filterDto: GetTasksFilterDto = {
        status: TaskStatus.OPEN,
        search: 'Some search query',
      };

      const result = await tasksController.getTasks(filterDto, mockUser);
      expect(tasksService.getTasks).toHaveBeenCalledWith(filterDto, mockUser);
      expect(result).toEqual('someTasks');
    });
  });

  describe('getTaskById', () => {
    it('should get a task by ID from the service', async () => {
      const mockTask = { id: 'someid', title: 'Test Task' };
      tasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await tasksController.getTaskById('someid', mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalledWith('someid', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task through the service', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test task',
        description: 'Test desc',
      };
      tasksService.createTask.mockResolvedValue('someTask');

      const result = await tasksController.createTask(createTaskDto, mockUser);
      expect(tasksService.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual('someTask');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task through the service', async () => {
      tasksService.deleteTask.mockResolvedValue(null);

      await tasksController.deleteTask('someid', mockUser);
      expect(tasksService.deleteTask).toHaveBeenCalledWith('someid', mockUser);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update the task status through the service', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: TaskStatus.DONE,
      };
      tasksService.updateTaskStatus.mockResolvedValue('updatedTask');

      const result = await tasksController.updateTaskStatus(
        'someid',
        updateTaskStatusDto,
        mockUser,
      );
      expect(tasksService.updateTaskStatus).toHaveBeenCalledWith(
        'someid',
        TaskStatus.DONE,
        mockUser,
      );
      expect(result).toEqual('updatedTask');
    });
  });
});
