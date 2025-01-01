run: compile_types compile_calendar compile_calendar_optimizer compile_solver link execute clean
compile_types:
	g++ -std=c++20 -c source/types.cpp -o ./source/types.out
compile_calendar:
	g++ -std=c++20 -c source/calendar.cpp -o ./source/calendar.out
compile_calendar_optimizer:
	g++ -std=c++20 -c source/calendar_optimizer.cpp -o ./source/calendar_optimizer.out
compile_solver:
	g++ -std=c++20 -c solver.cpp -o solver.out
link:
	g++ ./source/types.out ./source/calendar.out ./source/calendar_optimizer.out solver.out -o solver_app
execute:
	./solver_app
clean:
	rm *.out
	rm source/*.out