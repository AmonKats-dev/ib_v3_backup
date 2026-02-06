from flask.signals import Namespace

namespace = Namespace()

user_created = namespace.signal('user_created')
user_updated = namespace.signal('user_updated')
user_logged_in = namespace.signal('user_logged_in')

project_created = namespace.signal('project_created')
project_updated = namespace.signal('project_updated')
project_dates_changed = namespace.signal('project_dates_changed')
project_data_changed = namespace.signal('project_data_changed')
project_moved_to_next_phase = namespace.signal('project_moved_to_next_phase')
project_status_changed = namespace.signal('project_status_changed')
project_analysis_submitted = namespace.signal('project_analysis_submitted')

project_detail_created = namespace.signal('project_detail_created')
project_detail_updated = namespace.signal('project_detail_updated')

project_option_created = namespace.signal('project_option_created')
project_option_updated = namespace.signal('project_option_updated')

outcome_created = namespace.signal('outcome_created')
outcome_updated = namespace.signal('outcome_updated')
outcomes_updated = namespace.signal('outcomes_updated')

output_created = namespace.signal('output_created')
output_updated = namespace.signal('output_updated')
outputs_updated = namespace.signal('outputs_updated')

activity_created = namespace.signal('activity_created')
activity_updated = namespace.signal('activity_updated')

me_report_updated = namespace.signal('me_report_updated')

investment_updated = namespace.signal('investment_updated')

cost_plan_created = namespace.signal('cost_plan_created')
cost_plan_updated = namespace.signal('cost_plan_updated')
