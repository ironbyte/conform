'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, signup, createTodos } from '@/app/actions';
import {
	useForm,
	intent,
	getFormProps,
	getInputProps,
	getFieldsetProps,
	getControlButtonProps,
} from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { todosSchema, loginSchema, createSignupSchema } from '@/app/schema';

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const { pending } = useFormStatus();

	return <button {...props} disabled={pending || props.disabled} />;
}

export function TodoForm() {
	const [lastResult, action] = useFormState(createTodos, undefined);
	const { meta, fields } = useForm({
		lastResult,
		onValidate({ formData }) {
			return parse(formData, { schema: todosSchema });
		},
		shouldValidate: 'onBlur',
	});
	const tasks = fields.tasks.getFieldList();

	return (
		<form action={action} {...getFormProps(meta)}>
			<div>
				<label>Title</label>
				<input
					className={!fields.title.valid ? 'error' : ''}
					{...getInputProps(fields.title)}
					key={fields.title.key}
				/>
				<div>{fields.title.error}</div>
			</div>
			<hr />
			<div className="form-error">{fields.tasks.error}</div>
			{tasks.map((task, index) => {
				const taskFields = task.getFieldset();

				return (
					<fieldset key={task.key} {...getFieldsetProps(task)}>
						<div>
							<label>Task #${index + 1}</label>
							<input
								className={!taskFields.content.valid ? 'error' : ''}
								{...getInputProps(taskFields.content)}
								key={taskFields.content.key}
							/>
							<div>{taskFields.content.error}</div>
						</div>
						<div>
							<label>
								<span>Completed</span>
								<input
									className={!taskFields.completed.valid ? 'error' : ''}
									{...getInputProps(taskFields.completed, {
										type: 'checkbox',
									})}
									key={taskFields.completed.key}
								/>
							</label>
						</div>
						<Button
							{...getControlButtonProps(meta.id, [
								intent.remove({ name: fields.tasks.name, index }),
							])}
						>
							Delete
						</Button>
						<Button
							{...getControlButtonProps(meta.id, [
								intent.reorder({ name: fields.tasks.name, from: index, to: 0 }),
							])}
						>
							Move to top
						</Button>
						<Button
							{...getControlButtonProps(meta.id, [
								intent.replace({ name: task.name, value: { content: '' } }),
							])}
						>
							Clear
						</Button>
					</fieldset>
				);
			})}
			<Button
				{...getControlButtonProps(meta.id, [
					intent.insert({ name: fields.tasks.name }),
				])}
			>
				Add task
			</Button>
			<hr />
			<Button>Save</Button>
		</form>
	);
}

export function LoginForm() {
	const [lastResult, action] = useFormState(login, undefined);
	const { meta, fields } = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parse(formData, { schema: loginSchema });
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
	});

	return (
		<form action={action} {...getFormProps(meta)}>
			<div>
				<label>Email</label>
				<input
					className={!fields.email.valid ? 'error' : ''}
					{...getInputProps(fields.email)}
					key={fields.email.key}
				/>
				<div>{fields.email.error}</div>
			</div>
			<div>
				<label>Password</label>
				<input
					className={!fields.password.valid ? 'error' : ''}
					{...getInputProps(fields.password, { type: 'password' })}
					key={fields.password.key}
				/>
				<div>{fields.password.error}</div>
			</div>
			<label>
				<div>
					<span>Remember me</span>
					<input {...getInputProps(fields.remember, { type: 'checkbox' })} />
				</div>
			</label>
			<hr />
			<Button>Login</Button>
		</form>
	);
}

export function SignupForm() {
	const [lastResult, action] = useFormState(signup, undefined);
	const { meta, fields } = useForm({
		lastResult,
		onValidate({ formData }) {
			return parse(formData, {
				// Create the schema without any constraint defined
				schema: (intents) => createSignupSchema(intents),
			});
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	});

	return (
		<form action={action} {...getFormProps(meta)}>
			<label>
				<div>Username</div>
				<input
					className={!fields.username.valid ? 'error' : ''}
					{...getInputProps(fields.username)}
					key={fields.username.key}
				/>
				<div>{fields.username.error}</div>
			</label>
			<label>
				<div>Password</div>
				<input
					className={!fields.password.valid ? 'error' : ''}
					{...getInputProps(fields.password, { type: 'password' })}
					key={fields.password.key}
				/>
				<div>{fields.password.error}</div>
			</label>
			<label>
				<div>Confirm Password</div>
				<input
					className={!fields.confirmPassword.valid ? 'error' : ''}
					{...getInputProps(fields.confirmPassword, { type: 'password' })}
					key={fields.confirmPassword.key}
				/>
				<div>{fields.confirmPassword.error}</div>
			</label>
			<hr />
			<Button>Signup</Button>
		</form>
	);
}
