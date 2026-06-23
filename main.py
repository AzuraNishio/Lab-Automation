from nicegui import ui

count = 0

def increment():
    global count
    count += 1
    counter.text = f'Button clicked {count} times'

ui.dark_mode()

with ui.column().classes('items-center w-full'):
    ui.label('Lab Automation Test').classes('text-h2')

    ui.label('Hello World!')

    counter = ui.label('Button clicked 0 times')

    ui.button('Click Me', on_click=increment)

ui.run(
    title='Lab Automation',
    favicon='w'
)