import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RegistrationSagaService {

  private readonly logger = new Logger(RegistrationSagaService.name);
  constructor(

    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,

  ) { }

  async executeRegistrationSaga(registerDto: any) {
    const rollbackActions: { name: string; action: () => Promise<any> }[] = [];
    try {
      this.logger.log('Starting User Registration Saga...');
      this.logger.log('Step 1: Creating User in auth-service...');

      // Step 1: Create User in auth-service
      const authResponse = await firstValueFrom<any>(this.authClient.send('auth.register', registerDto));
      const userId = authResponse?.user?._id;

      if (!userId) {
        throw new Error('User creation succeeded but no userId was returned.');
      }
      this.logger.log('User created successfully in auth-service:', userId);

      // Register the rollback action for Step 1
      rollbackActions.push({
        name: 'Delete User from auth-service',
        action: () => firstValueFrom(this.authClient.send('auth.deleteUser', { userId })),
      });


      //  Step 2: Create Welcome Task in task-service
      this.logger.log(`Step 2: Creating Welcome Task for user: ${userId}...`);

      const taskResponse = await firstValueFrom<any>(this.taskClient.send('task.createSaga', {
        title: 'Welcome to WorkflowHub',
        description: `Welcome ${authResponse.user.name} to WorkflowHub. To get started, please complete the following steps`,
        userId
      }))

      const taskId = taskResponse?.task?._id;
      if (!taskId) {
        throw new Error('Task creation failed: No taskId returned')
      }

      // Register the rollback action for Step 2
      rollbackActions.push({
        name: 'Delete Task from task-service',
        action: () => firstValueFrom(this.taskClient.send('task.deleteSaga', { taskId })),
      });

      // Step 3: Create Welcome Notification in notification-service
      this.logger.log('Step 3: Sending Welcome Notification...');

      const notificationResponse = await firstValueFrom<any>(this.notificationClient.send('notification.sendSaga', {
        userId,
        taskId,
        title: 'Welcome to WorkflowHub!',
        message: `Hello ${authResponse.user.name}, your account is ready.`,
        type: 'EMAIL',
      }))

      const notificationId = notificationResponse?.notification?._id;
      // Register the rollback action for Step 3 (optional, in case of cleanup)
      rollbackActions.push({
        name: 'Delete Notification from notification-service',
        action: () => firstValueFrom(this.notificationClient.send('notification.deleteSaga', { notificationId })),
      });
      this.logger.log('User Registration Saga completed successfully!');
      return {
        message: 'Registration workflow completed successfully',
        user: authResponse.user,
        token: authResponse.token,
      };

    }
    catch (error) {
      this.logger.error(`Saga failed! Error: ${error.message}. Initiating rollback...`);

      await this.rollback(rollbackActions);

      throw new HttpException(
        error.message || 'User Registration failed',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      );

    }
  }

  private async rollback(actions: { name: string; action: () => Promise<any> }[]) {
    // Execute rollback actions in reverse order
    for (let i = actions.length - 1; i >= 0; i--) {
      const rollback = actions[i];
      try {
        this.logger.warn(`Rolling back: ${rollback.name}...`);
        await rollback.action();
        this.logger.log(`Successfully completed rollback: ${rollback.name}`);
      } catch (rollbackError) {
        this.logger.error(
          `Failed to execute rollback: ${rollback.name}. Error: ${rollbackError.message}`
        );
        // In production, failed rollbacks should trigger critical alerts/logs for manual recovery.
      }
    }
  }

}